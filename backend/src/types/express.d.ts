export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenant_id: string;
        role: string;
      };
      tenant?: {
        id: string;
      };
    }
  }
}
