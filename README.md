# BACK END SERVER FOR ORDERY PROJECT

## Requests:

### Menu :

**get all menu items**
http://localhost:3100/api/menu \
**get specific menu item**
http://localhost:3100/api/menu/(menu_item_id) \
**post new menu item**
http://localhost:3100/api/menu/newitem \
data { \
**name** : string and unique, \
**description** : string, \
**price** : number, \
**image** : string, \
**categories** : array of strings \
}

### User :

**post user login**
http://localhost:3100/api/login \
http://localhost:3100/api/forcelogin \
data { \
**phone** : string, \
**passowrd** : string \
} \
**post user register**
http://localhost:3100/api/user/new \
data { \
**phone** : string and unique, \
**password** : string, \
**fName** : string, \
**lName** : string, \
**address** : string, \
**city** : string, \
}

### Admin :

**post admin login**
http://localhost:3100/controlpanel/login \
data { \
**username** : string, \
**passowrd** : string \
} \
**post admin register**
http://localhost:3100/controlpanel/register \
data { \
**username** : string and unique, \
**passowrd** : string, \
**name** : string, \
**role** : number from 1 to 5, \
}
