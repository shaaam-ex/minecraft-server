export interface CreateServerBody {
  name: string;
  type: string;
  version: string;
  configuration?: Record<string, any>;
}
