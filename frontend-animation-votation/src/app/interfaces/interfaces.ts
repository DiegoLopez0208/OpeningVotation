export interface Opening {
  _id: string;
  title: string;
  url: string;
  start: string;
  chorus: string;
}

export interface Vote {
  _id: string;
  openingId: string;
  userId: string;
  vote: number | undefined;
  submittedBy: string;
}

export interface Entry {
  name: string;
  value: string;
}

export interface OpeningList {
  title: string;
  index: number;
  participants: Entry[];
  vote: string;
}
