/**
* Mapping of Key/Value Pairs. With optional typing.
*/
export interface Map<T = string>{
	[key:string]: T
}