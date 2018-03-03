import Vue from 'vue'

var filterUsers = {


  foo(users, filterArray, string, search, ascDesc, membership_id, group_id, gender) {
    let result = users;
    result = users.filter(function(user) {
      let fullname = user.first_name + ' ' + user.last_name + ' ' + user.code;
      if(filterArray){
        return fullname.toLowerCase().indexOf(search.toLowerCase()) >= 0 && user.status == filterArray.value;
      }else {
        return fullname.toLowerCase().indexOf(search.toLowerCase()) >= 0;
      }
    });

    if(membership_id){
      result = result.filter(function(user) {
        for(var i=0; i<user.membership_types.length; i++){
          if(user.membership_types[i].id == membership_id.value){
            return user.membership_types[i].id == membership_id.value;
          }
       }
     });
     }
     if(group_id){
       result = result.filter(function(user) {
         for(var i=0; i<user.groups.length; i++){
           if(user.groups[i].id == group_id.value){
             return user.groups[i].id == group_id.value;
           }
        }
      });
      }

      if(gender){
      result = result.filter(function(user) {
            return user.sex == gender.value;
     });
     }


    return _.orderBy(result, string, ascDesc);

  }
}

export default filterUsers
