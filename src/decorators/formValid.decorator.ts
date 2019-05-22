import { FormGroup } from '@angular/forms';
export function FormValid( forms : string[] ){
  return function ( target : any, propertyKey : string, descriptor : PropertyDescriptor ) {
    const raw = descriptor.value ;
    descriptor.value = function( ...arg ){
      let mark = true ;
      forms.forEach( item  => {
        if( ( < FormGroup >< any >this[item] ).valid === false ){
          this.msg.error("请检查填写的内容是否正确") ;
          mark = false ;
          return false ;
        };
      });

      if(mark)
        raw.apply(this , arg) ;
    };
  };
};
