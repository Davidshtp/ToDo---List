export const friendlyTime = (duration: number) => {
    const hour = duration / (60 * 60 * 1000);
    const min = (duration - (hour * (60 * 60 * 1000))) / (60*1000);
    const sec = ((duration - (hour * (60 * 60 * 1000))) - (min * 60 * 1000)) / 1000

    return {
        hour, min, sec
    }

}