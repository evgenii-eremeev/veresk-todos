
export function signalSetter(signal) {
    return (getNewValue) => {
        signal.value = getNewValue(signal.peek())
    }
}