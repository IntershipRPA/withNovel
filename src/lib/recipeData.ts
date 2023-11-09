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
  actionID: number,
  andGroup: number,
  fac: string,
  tag: string,
  value: string,
  unit: string,
  range: string,
  memo: string,
}
export interface Recipe {
  recipeID: number,
  actions: Action[],
  conditions: Condition[],
}