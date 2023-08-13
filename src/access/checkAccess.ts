import AccessEnum from "@/access/accessEnum";

/**
 * 检查权限（判断当前用户是否具有某个权限）
 * @param loginUser 当前登录的用户
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess = AccessEnum.NOT_LOGIN) => {
  // 获取当前用户具有的权限（如果没有 loginUser， 则表示未登录）
  const loginUserAccess = loginUser?.userRole ?? AccessEnum.NOT_LOGIN;
  // 当前未登录
  if (needAccess === AccessEnum.NOT_LOGIN) {
    return true;
  }
  // 当前已登录
  if (needAccess === AccessEnum.USER) {
    // 如果当前用户未登录，那么表示无权限
    if (loginUserAccess === AccessEnum.NOT_LOGIN) {
      return false;
    }
    return true;
  }
  // 获取管理员具有的权限
  if (needAccess === AccessEnum.ADMIN) {
    // 如果不为管理员，则表示无权限
    if (loginUserAccess !== AccessEnum.ADMIN) {
      return false;
    }
    return true;
  }
  return true;
};

export default checkAccess;
