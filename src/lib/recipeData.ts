export interface Condition {
  conditionID: number,
  andGroup: number,
  fac: string,
  tag: string,
  value: string,
  unit: string,
  range: string,
  memo: string,
}
export interface Action {
  // actionID: number,
  // andGroup: number,
  fac: string,
  tag: string,
  value: string,
  unit: string,
  range: string,
  memo: string,
}
export interface AiData {
  // recipeID: number,
  // actions: Action[],
  action: Action,
  conditions: Condition[],
}
export interface Recipe {
  recipeID: number,
  recipeType: string,
  content: object,
  recipeName: string
}
