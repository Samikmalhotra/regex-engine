const insertConcatOperator = (exp: string): string => {
  let output = "";
  for (let i = 0; i < exp.length; i++) {
    const token = exp[i];
    output = output + token;

    if (token === "(" || token === "|") {
      continue;
    }

    if (i < exp.length - 1) {
      let lookahead = exp[i + 1];

      if (lookahead === "*" || lookahead === "|" || lookahead === ")") {
        continue;
      }

      output = output + ".";
    }
  }

  return output;
};
