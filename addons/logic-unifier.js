"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LCU {
    static IS_NULL_ITEM(entity) {
        return entity === null || entity === undefined;
    }
    static IS_NULL_ARRAY(entities) {
        return this.IS_NULL_ITEM(entities) || entities.some(entity => this.IS_NULL_ITEM(entity));
    }
}
exports.default = LCU;
