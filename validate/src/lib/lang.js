export default function lang(lang='cn'){
  let cn = {
    required        : '请填写$title !',
    select_required : '请选择$title !',
    length_max      : '$title不能大于$max个字 !',
    length_min      : '$title不能小于$min个字 !',
    number_max      : '$title不能大于$max !',
    number_min      : '$title不能小于$min !',
    checked_min     : '$title至少选择$min项 !',
    checked_max     : '$title最多选择$max项 !',
    email           : '$title格式输入不正确 !',
    number          : '$title请填写整数 !',
    float           : '$title请填写数字 !',
    mobile          : '$title输入不正确 !',
    pattern         : '$title不符合规范 !',
    ismax           : '结束$title不能小于开始$title',
    repassword      : '两次输入的密码不一致'
  }
  let en = {}
  return eval(lang);
};