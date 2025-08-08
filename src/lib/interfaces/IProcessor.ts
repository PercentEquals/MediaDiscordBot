export default interface IProcessor<T> {
    execute(): Promise<T>;
}