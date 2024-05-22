export default class LCU {
    public static IS_NULL_ITEM(entity: any): boolean {
        return entity === null || entity === undefined;
    }
    
    public static IS_NULL_ARRAY(entities: any[]): boolean {
        return this.IS_NULL_ITEM(entities) || entities.some(entity => this.IS_NULL_ITEM(entity));
    }
}