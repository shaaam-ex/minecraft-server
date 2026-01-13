export interface CreateServerBody {
  name: string;
  status: boolean;
  configuration?: Record<string, any>;
  version: string;
}
