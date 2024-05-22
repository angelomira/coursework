import colors from 'colors/safe'

export default class Loggerin {
    static info(...data: any[]): void {
        const datetime = new Date().toLocaleString();

        console.info(
            colors.blue(`[${datetime}] \t - ${data.join(' ')}`));
    }

    static warn(...data: any[]): void {
        const datetime = Date.now().toLocaleString();

        console.warn(
            colors.yellow(`[${datetime}] \t - ${data.join(' ')}`));
    }

    static error(...data: any[]): void {
        const datetime = Date.now().toLocaleString();

        console.error(
            colors.bgRed(colors.white(`[${datetime}] \t - ${data.join(' ')}`)));
    }
}