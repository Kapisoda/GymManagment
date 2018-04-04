import Vue from 'vue'

var filterUsers = {


  foo(users, filterArray, string, search, ascDesc, membership_id, group_id, gender) {
    let result = users;
    result = users.filter(function(user) {
      var membership;
      var groups;
      if(typeof user.membership_types !== 'undefined' && user.membership_types.length > 0){
        user.membership_types.forEach(function(element) {
          membership += element.name;
        });
      }
      if(typeof user.groups !== 'undefined' && user.groups.length > 0){
        user.groups.forEach(function(element) {
          groups += element.name;
        });
      }
      let fullname = user.first_name + ' ' + user.last_name + ' ' + user.code +' '+membership + ' ' + groups;
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
