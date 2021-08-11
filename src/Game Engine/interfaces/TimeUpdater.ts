export default interface TimeUpdater {
    update: (deltaTime?: number) => void;
}
