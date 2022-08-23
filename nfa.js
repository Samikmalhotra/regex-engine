// /**
//  * State in Thompson's NFA can either have 
//    - a single symbol transition to a state
//     or
//    - up to two epsilon transitions to another states
//   but not both.   
//  */
// function createState(isEnd){
//     return {
//         isEnd,
//         transition: {},
//         epsilonTransition: []
//     }; 
// }

// function addEpsilonTransition(from, to){
//     from.epsilonTransition.push(to)
// }