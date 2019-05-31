var farm = {
    cow: 2,
    fish: 0
};

farm['sheep'] = (farm['sheep'] + 1) || 1;

/* Output:
    farm {
        cow: 3,
        fish: 0,
        sheep: 1
    }
*/

