export interface IState {
  isEnd: boolean;
  transition: object;
  epsilonTransition: IState[];
}

export interface INfa {
  start: IState;
  end: IState;
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
function fromEpsilon(): INfa {
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
function fromSymbol(symbol: string): INfa {
  const start = createState(false);
  const end = createState(true);
  addTransition(start, end, symbol);

  return { start, end };
}

/**
 * Concatenating two NFA's
 * @param first - Starting NFA
 * @param second - Ending NFA
 * @returns Concatenated NFA
 */
function concat(first: INfa, second: INfa): INfa {
  addEpsilonToTransition(first.end, second.start);
  first.end.isEnd = false;

  return {
    start: first.start,
    end: second.end,
  };
}

/**
 * Union of two NFAs
 * @param first
 * @param second
 * @returns Unionized NFA
 */
function union(first: INfa, second: INfa): INfa {
  const start = createState(false);
  addEpsilonToTransition(start, first.start);
  addEpsilonToTransition(start, second.start);

  const end = createState(true);

  addEpsilonToTransition(first.end, end);
  first.end.isEnd = false;
  addEpsilonToTransition(second.end, end);
  second.end.isEnd = false;

  return {
    start,
    end,
  };
}

/**
 * Kleene Closure
 * @param first NFA
 * @returns NFA
 */
function closure(first: INfa) {
  const start = createState(false);
  const end = createState(true);

  addEpsilonToTransition(start, end);
  addEpsilonToTransition(start, first.start);

  addEpsilonToTransition(first.end, end);
  addEpsilonToTransition(first.end, first.start);

  first.end.isEnd = false;

  return {
    start,
    end,
  };
}
