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

function addEpsilonTransition(from: IState, to: IState): void {
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
  addEpsilonTransition(start, end);

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
  addEpsilonTransition(first.end, second.start);
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
  addEpsilonTransition(start, first.start);
  addEpsilonTransition(start, second.start);

  const end = createState(true);

  addEpsilonTransition(first.end, end);
  first.end.isEnd = false;
  addEpsilonTransition(second.end, end);
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

  addEpsilonTransition(start, end);
  addEpsilonTransition(start, first.start);

  addEpsilonTransition(first.end, end);
  addEpsilonTransition(first.end, first.start);

  first.end.isEnd = false;

  return {
    start,
    end,
  };
}

function toNFA(postFixExp: string): INfa {
  if (postFixExp === "") {
    return fromEpsilon();
  }

  const stack = [];

  for (const token of postFixExp) {
    if (token === "*") {
      stack.push(closure(stack.pop()));
    } else if (token === "|") {
      const right = stack.pop();
      const left = stack.pop();
      stack.push(union(left, right));
    } else if (token === ".") {
      const right = stack.pop();
      const left = stack.pop();
      stack.push(concat(left, right));
    } else {
      stack.push(fromSymbol(token));
    }
  }

  return stack.pop();
}
