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