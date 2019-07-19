export class Customer {

  constructor(public firstName = '',
    public lastName = '',
    public email = '',
    public sendCatalog = false,
    public addressType = 'home',
    public street1?: string,
    public street2?: string,
    public city?: string,
    public state = '',
    public zip?: string) { }
}

/**
 * We are using a class and not and interface in this case
 * because we want to create a new instance of this class
 * for the new customer information
 */