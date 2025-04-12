import { DurableObject } from "cloudflare:workers";

// Define types for our data
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

export interface WineEntry {
  id: string;
  name: string;
  type: string;
  vintage: number;
  origin: string;
  ratings: {
    aroma: number;
    taste: number;
    balance: number;
    finish: number;
    value: number;
  };
  notes: string;
  imageId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuthResponse {
  userId: string;
  token: string;
  expiresAt: number;
}

/**
 * UserObject - Durable Object to store user data and wine collections
 */
export class UserObject extends DurableObject<Env> {
  private user: User | null = null;
  private wines: Map<string, WineEntry> = new Map();
  private tokens: Map<string, { userId: string, expiresAt: number }> = new Map();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  // Initialize a user
  async createUser(data: { username: string, email: string, password: string }): Promise<User> {
    if (this.user) {
      throw new Error("User already exists");
    }

    const id = crypto.randomUUID();
    const passwordHash = await this.hashPassword(data.password);
    
    const user: User = {
      id,
      username: data.username,
      email: data.email,
      passwordHash,
      createdAt: Date.now(),
    };
    
    await this.state.storage.put("user", user);
    this.user = user;
    return user;
  }

  // Get user data
  async getUser(): Promise<User | null> {
    if (!this.user) {
      this.user = await this.state.storage.get("user");
    }
    return this.user;
  }

  // Authenticate a user
  async authenticate(email: string, password: string): Promise<AuthResponse | null> {
    const user = await this.getUser();
    
    if (!user || user.email !== email) {
      return null;
    }
    
    const isValid = await this.verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return null;
    }
    
    // Generate a token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    
    // Store the token
    await this.state.storage.put(`token:${token}`, {
      userId: user.id,
      expiresAt
    });
    
    this.tokens.set(token, { userId: user.id, expiresAt });
    
    return {
      userId: user.id,
      token,
      expiresAt
    };
  }

  // Verify a token
  async verifyToken(token: string): Promise<boolean> {
    let tokenInfo = this.tokens.get(token);
    
    if (!tokenInfo) {
      tokenInfo = await this.state.storage.get(`token:${token}`);
      if (tokenInfo) {
        this.tokens.set(token, tokenInfo);
      }
    }
    
    if (!tokenInfo || tokenInfo.expiresAt < Date.now()) {
      return false;
    }
    
    return true;
  }

  // Revoke a token
  async revokeToken(token: string): Promise<boolean> {
    await this.state.storage.delete(`token:${token}`);
    this.tokens.delete(token);
    return true;
  }

  // Add a wine to the user's collection
  async addWine(wine: Omit<WineEntry, "id" | "createdAt" | "updatedAt">): Promise<WineEntry> {
    const id = crypto.randomUUID();
    const timestamp = Date.now();
    
    const newWine: WineEntry = {
      id,
      ...wine,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    await this.state.storage.put(`wine:${id}`, newWine);
    this.wines.set(id, newWine);
    
    return newWine;
  }

  // Get a specific wine by ID
  async getWine(id: string): Promise<WineEntry | null> {
    let wine = this.wines.get(id);
    
    if (!wine) {
      wine = await this.state.storage.get(`wine:${id}`);
      if (wine) {
        this.wines.set(id, wine);
      }
    }
    
    return wine || null;
  }

  // Get all wines for this user
  async getWines(): Promise<WineEntry[]> {
    // If we haven't loaded wines yet, load them from storage
    if (this.wines.size === 0) {
      const prefix = "wine:";
      const wineEntries = await this.state.storage.list({ prefix });
      
      for (const [key, value] of wineEntries) {
        const id = key.slice(prefix.length);
        this.wines.set(id, value as WineEntry);
      }
    }
    
    return Array.from(this.wines.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  // Update a wine entry
  async updateWine(id: string, updates: Partial<Omit<WineEntry, "id" | "createdAt" | "updatedAt">>): Promise<WineEntry | null> {
    const wine = await this.getWine(id);
    
    if (!wine) {
      return null;
    }
    
    const updatedWine: WineEntry = {
      ...wine,
      ...updates,
      updatedAt: Date.now(),
    };
    
    await this.state.storage.put(`wine:${id}`, updatedWine);
    this.wines.set(id, updatedWine);
    
    return updatedWine;
  }

  // Delete a wine entry
  async deleteWine(id: string): Promise<boolean> {
    const wine = await this.getWine(id);
    
    if (!wine) {
      return false;
    }
    
    await this.state.storage.delete(`wine:${id}`);
    this.wines.delete(id);
    
    return true;
  }

  // Helper method to hash passwords
  private async hashPassword(password: string): Promise<string> {
    // In a real implementation, you would use a proper password hashing algorithm
    // Since we have limited crypto capabilities in Durable Objects, we'll use a simple hash for demo purposes
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Helper method to verify passwords
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  // Handle HTTP requests
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Authentication endpoints
    if (path === "/auth") {
      if (method === "POST") {
        try {
          const { email, password } = await request.json() as { email: string, password: string };
          const authResponse = await this.authenticate(email, password);
          
          if (!authResponse) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
              status: 401,
              headers: { "Content-Type": "application/json" }
            });
          }
          
          return new Response(JSON.stringify(authResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      } else if (method === "DELETE") {
        try {
          const { token } = await request.json() as { token: string };
          await this.revokeToken(token);
          
          return new Response(null, { status: 204 });
        } catch (error) {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }

    // User registration
    if (path === "/register" && method === "POST") {
      try {
        const data = await request.json() as { username: string, email: string, password: string };
        
        // Check if user already exists
        const existingUser = await this.getUser();
        if (existingUser) {
          return new Response(JSON.stringify({ error: "User already exists" }), {
            status: 409,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        const user = await this.createUser(data);
        
        // Remove password hash from response
        const { passwordHash, ...userResponse } = user;
        
        return new Response(JSON.stringify(userResponse), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // User endpoints
    if (path === "/user") {
      if (method === "GET") {
        // Verify authentication
        const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token || !(await this.verifyToken(token))) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        const user = await this.getUser();
        if (!user) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        // Remove password hash from response
        const { passwordHash, ...userResponse } = user;
        
        return new Response(JSON.stringify(userResponse), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    // Wine collection endpoints
    if (path === "/wines") {
      // Verify authentication
      const token = request.headers.get("Authorization")?.split("Bearer ")[1];
      if (!token || !(await this.verifyToken(token))) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      if (method === "GET") {
        const wines = await this.getWines();
        return new Response(JSON.stringify(wines), {
          headers: { "Content-Type": "application/json" }
        });
      } else if (method === "POST") {
        const wine = await request.json() as Omit<WineEntry, "id" | "createdAt" | "updatedAt">;
        const newWine = await this.addWine(wine);
        return new Response(JSON.stringify(newWine), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    // Single wine endpoints
    const wineMatch = path.match(/\/wines\/([^/]+)$/);
    if (wineMatch) {
      // Verify authentication
      const token = request.headers.get("Authorization")?.split("Bearer ")[1];
      if (!token || !(await this.verifyToken(token))) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      const id = wineMatch[1];
      
      if (method === "GET") {
        const wine = await this.getWine(id);
        if (!wine) {
          return new Response("Wine not found", { status: 404 });
        }
        return new Response(JSON.stringify(wine), {
          headers: { "Content-Type": "application/json" }
        });
      } else if (method === "PUT" || method === "PATCH") {
        const updates = await request.json() as Partial<Omit<WineEntry, "id" | "createdAt" | "updatedAt">>;
        const updatedWine = await this.updateWine(id, updates);
        if (!updatedWine) {
          return new Response("Wine not found", { status: 404 });
        }
        return new Response(JSON.stringify(updatedWine), {
          headers: { "Content-Type": "application/json" }
        });
      } else if (method === "DELETE") {
        const success = await this.deleteWine(id);
        if (!success) {
          return new Response("Wine not found", { status: 404 });
        }
        return new Response(null, { status: 204 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}