import { DurableObject } from "cloudflare:workers";

interface Participant {
  id: string;
  username: string;
  connected: boolean;
  ratings?: {
    aroma?: number;
    taste?: number;
    balance?: number;
    finish?: number;
    value?: number;
  };
  notes?: string;
}

interface TastingSession {
  id: string;
  wineName: string;
  wineDetails?: {
    type: string;
    vintage: number;
    origin: string;
  };
  createdBy: string;
  participants: Record<string, Participant>;
  createdAt: number;
  active: boolean;
}

/**
 * SessionObject - Durable Object to manage collaborative wine tasting sessions
 */
export class SessionObject extends DurableObject<Env> {
  private session: TastingSession | null = null;
  private webSockets: Map<string, WebSocket> = new Map();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  // Create a new tasting session
  async createSession(data: { 
    wineName: string, 
    wineDetails?: TastingSession['wineDetails'], 
    createdBy: string,
    creatorUsername: string
  }): Promise<TastingSession> {
    const id = crypto.randomUUID();
    const session: TastingSession = {
      id,
      wineName: data.wineName,
      wineDetails: data.wineDetails,
      createdBy: data.createdBy,
      participants: {
        [data.createdBy]: {
          id: data.createdBy,
          username: data.creatorUsername,
          connected: true
        }
      },
      createdAt: Date.now(),
      active: true
    };
    
    await this.state.storage.put("session", session);
    this.session = session;
    return session;
  }

  // Get session data
  async getSession(): Promise<TastingSession | null> {
    if (!this.session) {
      this.session = await this.state.storage.get("session");
    }
    return this.session;
  }

  // Add a participant to the session
  async addParticipant(userId: string, username: string): Promise<Participant> {
    const session = await this.getSession();
    if (!session) {
      throw new Error("Session not found");
    }
    
    const participant: Participant = {
      id: userId,
      username,
      connected: true
    };
    
    session.participants[userId] = participant;
    await this.state.storage.put("session", session);
    
    // Broadcast to all connected clients
    this.broadcast(JSON.stringify({
      type: "participant-joined",
      participant
    }));
    
    return participant;
  }

  // Update participant ratings
  async updateRatings(userId: string, ratings: Participant['ratings']): Promise<void> {
    const session = await this.getSession();
    if (!session || !session.participants[userId]) {
      throw new Error("Session or participant not found");
    }
    
    session.participants[userId].ratings = {
      ...session.participants[userId].ratings,
      ...ratings
    };
    
    await this.state.storage.put("session", session);
    
    // Broadcast the update to all connected clients
    this.broadcast(JSON.stringify({
      type: "ratings-updated",
      userId,
      ratings: session.participants[userId].ratings
    }));
  }

  // Update participant notes
  async updateNotes(userId: string, notes: string): Promise<void> {
    const session = await this.getSession();
    if (!session || !session.participants[userId]) {
      throw new Error("Session or participant not found");
    }
    
    session.participants[userId].notes = notes;
    await this.state.storage.put("session", session);
    
    // Broadcast the update to all connected clients
    this.broadcast(JSON.stringify({
      type: "notes-updated",
      userId,
      notes
    }));
  }

  // End the tasting session
  async endSession(): Promise<void> {
    const session = await this.getSession();
    if (!session) {
      throw new Error("Session not found");
    }
    
    session.active = false;
    await this.state.storage.put("session", session);
    
    // Broadcast session end to all connected clients
    this.broadcast(JSON.stringify({
      type: "session-ended"
    }));
    
    // Close all WebSocket connections
    for (const webSocket of this.webSockets.values()) {
      webSocket.close(1000, "Session ended");
    }
    this.webSockets.clear();
  }

  // Broadcast a message to all connected WebSocket clients
  private broadcast(message: string): void {
    for (const webSocket of this.webSockets.values()) {
      webSocket.send(message);
    }
  }

  // Handle HTTP requests and WebSocket connections
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // WebSocket connection
    if (request.headers.get("Upgrade") === "websocket") {
      const params = new URLSearchParams(url.search);
      const userId = params.get("userId");
      const username = params.get("username");
      
      if (!userId || !username) {
        return new Response("User ID and username are required", { status: 400 });
      }

      // Accept the WebSocket connection
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      // Set up the server-side WebSocket handlers
      server.accept();
      
      // Store the WebSocket connection
      this.webSockets.set(userId, server);
      
      // Handle WebSocket messages
      server.addEventListener("message", async event => {
        try {
          const message = JSON.parse(event.data as string);
          
          switch (message.type) {
            case "update-ratings":
              await this.updateRatings(userId, message.ratings);
              break;
            case "update-notes":
              await this.updateNotes(userId, message.notes);
              break;
            default:
              console.warn("Unknown message type:", message.type);
          }
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
        }
      });
      
      // Handle WebSocket closure
      server.addEventListener("close", async () => {
        this.webSockets.delete(userId);
        
        // Update participant connection status
        const session = await this.getSession();
        if (session && session.participants[userId]) {
          session.participants[userId].connected = false;
          await this.state.storage.put("session", session);
          
          // Notify other participants
          this.broadcast(JSON.stringify({
            type: "participant-disconnected",
            userId
          }));
        }
      });
      
      // Add the participant to the session if not already present
      const session = await this.getSession();
      if (session && !session.participants[userId]) {
        await this.addParticipant(userId, username);
      } else if (session && session.participants[userId]) {
        // Update connection status if already a participant
        session.participants[userId].connected = true;
        await this.state.storage.put("session", session);
        
        // Notify other participants
        this.broadcast(JSON.stringify({
          type: "participant-reconnected",
          userId
        }));
      }
      
      // Send the current session state to the new client
      server.send(JSON.stringify({
        type: "session-state",
        session: await this.getSession()
      }));
      
      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }

    // Regular HTTP endpoints
    if (path === "/session") {
      if (method === "GET") {
        const session = await this.getSession();
        return new Response(JSON.stringify(session), {
          headers: { "Content-Type": "application/json" }
        });
      } else if (method === "POST") {
        const data = await request.json() as Parameters<typeof this.createSession>[0];
        const session = await this.createSession(data);
        return new Response(JSON.stringify(session), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      } else if (method === "DELETE") {
        await this.endSession();
        return new Response(null, { status: 204 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}