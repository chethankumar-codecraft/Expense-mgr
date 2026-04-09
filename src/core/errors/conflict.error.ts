export class ConflictError extends Error {
  conflictProperties: string[];
  conflictMessage: string;

  constructor(conflictProperties: string[], conflictMessage: string) {
    super();
    this.conflictProperties = conflictProperties;
    this.conflictMessage = conflictMessage;
  }
}

// export class ConflictError extends Error {
//   conflictProperty: string;
//   conflictMessage: string;
//   constructor(conflictProperty: string, conflictMessage: string) {
//     super();
//     this.conflictProperty = conflictProperty;
//     this.conflictMessage = conflictMessage;
//   }
// }
