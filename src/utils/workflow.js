export function generateBits(flowbits) {
  const bits = []
  for (let i = 0; i <= 28; i++) {
    bits.push((flowbits >>> i) & 1)
  }
  return bits
}

export function bitsOKUntil(bits, idx) {
  for (let i = 0; i < idx; i++) {
    if (bits[i] !== 1) {
      return false
    }
  }
  return true
}

export function codeToString(code) {
  let ret = ''
  const performanceMap = {
    '-1': '无可执行操作',
    '0': '无可执行操作',
    '1': '等待项目审批',
    '2': '等待配置仓库',
    '3': '等待配置EPG',
    '4': '等待配置QA',
    '5': '等待设定成员',
    '6': '等待设定权限',
    '7': '等待设定功能',
    '8': '等待启动项目',
    '9': '等待交付项目',
    '10': '等待确认交付完成',
    '11': '等待归档文件1',
    '12': '等待归档文件2',
    '13': '等待归档文件3',
    '14': '等待归档文件4',
    '15': '等待归档文件5',
    '16': '等待归档文件6',
    '17': '等待归档文件7',
    '18': '等待归档文件8',
    '19': '等待归档文件9',
    '20': '等待归档文件10',
    '21': '等待归档文件11',
    '22': '等待归档文件12',
    '23': '等待归档文件13',
    '24': '等待归档文件14',
    '25': '等待归档文件15',
    '26': '等待归档文件16',
    '27': '等待归档文件17',
    '28': '确认归档，可结项项目'
  }
  for (const it of code) {
    ret += performanceMap[it] + ' '
  }
  return ret
}
export function generateWhatToDo(flowbits, role) {
  const bits = generateBits(flowbits)
  function canDo(performance_bit) {
    return canProjectDo(flowbits, performance_bit) && bits[performance_bit] === 0
  }
  const ret = []
  switch (role) {
    case 'pm':
      if (canDo(27)) {
        ret.push(27)
      }
      if (canDo(26)) {
        ret.push(26)
      }
      if (canDo(25)) {
        ret.push(25)
      }
      if (canDo(24)) {
        ret.push(24)
      }
      if (canDo(23)) {
        ret.push(23)
      }
      if (canDo(22)) {
        ret.push(22)
      }
      if (canDo(21)) {
        ret.push(21)
      }
      if (canDo(20)) {
        ret.push(20)
      }
      if (canDo(19)) {
        ret.push(19)
      }
      if (canDo(18)) {
        ret.push(18)
      }
      if (canDo(17)) {
        ret.push(17)
      }
      if (canDo(16)) {
        ret.push(16)
      }
      if (canDo(15)) {
        ret.push(15)
      }
      if (canDo(14)) {
        ret.push(14)
      }
      if (canDo(13)) {
        ret.push(13)
      }
      if (canDo(12)) {
        ret.push(12)
      }
      if (canDo(11)) {
        ret.push(11)
        return ret
      }
      if (canDo(10)) {
        return [10]
      }
      if (canDo(9)) {
        return [9]
      }
      if (canDo(8)) {
        return [8]
      }
      // eslint-disable-next-line no-case-declarations
      if (canDo(7)) {
        ret.push(7)
      }
      if (canDo(6)) {
        ret.push(6)
        return ret
      }
      if (canDo(5)) {
        return [5]
      }
      return [-1]
    case 'pm_manager':
      if (canDo(1)) {
        return [1]
      }
      return [-1]
    case 'configurer':
      if (canDo(28)) {
        return [28]
      }
      if (canDo(2)) {
        return [2]
      }
      return [-1]
    case 'epg_leader':
      if (canDo(3)) {
        return [3]
      }
      return [-1]
    case 'qa_manager':
      if (canDo(4)) {
        return [4]
      }
      return [-1]
  }
}

export function canProjectDo(flowbits, performance_bit) {
  const bits = generateBits(flowbits)
  switch (performance_bit) {
    case 0:
      return false
    case 1:
      return bitsOKUntil(bits, 1)
    case 2:
    case 3:
    case 4:
      return bitsOKUntil(bits, 2)
    case 5:
      return bitsOKUntil(bits, 5)
    case 6:
    case 7:
      return bitsOKUntil(bits, 6)
    case 8:
      return bitsOKUntil(bits, 8)
    case 9:
      return bitsOKUntil(bits, 9)
    case 10:
      return bitsOKUntil(bits, 10)
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
      return bitsOKUntil(bits, 11)
    case 28:
      return bitsOKUntil(bits, 28)
    default:
      return false
  }
}
