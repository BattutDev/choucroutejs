export default abstract class BaseStore<S> {

	abstract storage: S;

	abstract get (sessionId: string): Promise<unknown>;

	abstract set (sessionId: string, session: unknown): Promise<unknown>;

	abstract destroy (sessionId: string): Promise<unknown>;

}