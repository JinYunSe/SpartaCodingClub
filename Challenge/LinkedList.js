class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
// class LinkedList {
//     length = 0;
//   constructor(value) {
//     this.head = new Node(value);
//     this.length++;
//   }
//   append(value) {
//     for()
//   }
//   print(index) {}
// }

class Stack {
  constructor() {
    this.head = null;
  }
  push(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
  }
  pop() {
    if (this.peek()) {
      const returnNode = this.head;
      this.head = this.head.next;
      return returnNode;
    }
    return null;
    //값이 없을 경우
  }
  // 맞는지는 잘 모르겠습니다 ㅎㅎ;;
  peek() {
    if (this.head === null) return null;
    return this.head.data;
  }
}

let list = new LinkedList(1);
list.append(2);

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  enqueue() {
    this.tail = this.head;
    while (this.tail.next !== null) {
      this.tail = this.tail.next;
    }
    return this.tail;
  }
  dequeue() {
    const returnNode = this.head;
    this.head = returnNode.next;
    return returnNode !== null ? returnNode : null;
  }
}
