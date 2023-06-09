interface Message {
  sender: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    isBot?: boolean;
    lang?: 'fr' | 'en' | string;
  };
  text: string;
  answer: (text: string) => Promise<any>;
};

type Listener = (message: Message) => void;

export default abstract class Source {
  protected listener: Listener;
  public init(listener: Listener): void {
    this.listener = listener;
  }
}
