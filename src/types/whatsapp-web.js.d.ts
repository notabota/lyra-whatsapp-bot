declare module 'whatsapp-web.js' {
    export class Client {
        constructor(options: any);
        on(event: string, callback: Function): void;
        initialize(): Promise<void>;
    }
    export class LocalAuth {}
} 