export interface IEngineInternal {
  epsilon: number;
  epsilonSq: number;
  allocArray(slot: number, length: number): number[];
}

class DefaultEngine implements IEngineInternal {
  public epsilon = 1e-8;
  public epsilonSq = 1e-16;
  public allocArray(slot: number, length: number) {
    const allocated = this.allocatedSlots[slot][length];
    if (allocated !== undefined) {
      return allocated;
    }

    const nextValue: number[] = [];
    nextValue.length = length;
    this.allocatedSlots[slot][length] = nextValue;
    this.maybeScheduleGc();
    return nextValue;
  }

  private maybeScheduleGc() {
    if (this.scheduledGc === undefined) {
      this.scheduledGc = setTimeout(() => {
        this.scheduledGc = undefined;
        this.allocatedSlots = [[], []];
      }, 5_000);
    }
  }

  private allocatedSlots: number[][][] = [[], []];
  private scheduledGc: number | undefined;
}

export const ENGINE: IEngineInternal = new DefaultEngine();
