export interface IState {
  isEnd: boolean;
  transition: object;
  epsilonTransition: IState[];
}

/**
 * State in Thompson's NFA can either have 
   - a single symbol transition to a state
    or
   - up to two epsilon transitions to another states
  but not both.   
 */
function createState(isEnd: boolean): IState {
  return {
    isEnd,
    transition: {},
    epsilonTransition: [],
  };
}

function addEpsilonToTransition(from: IState, to: IState): void {
  from.epsilonTransition.push(to);
}

/**
 *   Thompson's NFA state can have only one transition to another state for a given symbol.
 */
function addTransition(from: IState, to: IState, symbol: string): void {
  from.transition[symbol] = to;
}

/**
 * Construct an NFA that recognizes only the empty string.
 * @returns start and end state
 */
function fromEpsilon() {
  const start = createState(false);
  const end = createState(true);
  addEpsilonToTransition(start, end);

  return { start, end };
}

/**
 *  Construct an NFA that recognizes only a single character string.
 * @param symbol string
 * @returns
 */
function fromSymbol(symbol: string) {
  const start = createState(false);
  const end = createState(true);
  addTransition(start, end, symbol);

  return { start, end };
}

/**
 * Concatenating 
 */
function concat(first,second){
    addEpsilonToTransition(first.end, second.start)
    first.end
}