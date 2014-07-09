function svc(id) {

    if (arguments.length !== svc.length) {
        throw 'Inventory must be initialized with an id';
    }

    ObjectUtils.ro(this, 'id', id);
};

return service;