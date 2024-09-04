let makeAlbum = (genres, plays) => {
  let order = new Map();
  // 중복 없이 장르 별
  // 전체 실행 횟수, 곡 넘버, 곡 별 실행 횟수를
  // 저장하기 위해 사용
  genres.forEach((element, index) => {
    if (!order.has(element)) order.set(element, { totalPlay: 0, music: [] });
    // 현재 장르가 order에 저장 돼 있지 않으면 저장할 공간 생성
    // key를 element(장르)로 저장하고
    // {totalPlay : 0, music : []}를 value로
    // totalPlay을 key, 전체실행횟수를 value로 사용한다.
    // music을 key, 각각의 노래 정보를 담을 배열을 value로 사용한다.
    order.get(element).totalPl += plays[index];
    // 전체 실행 횟수를 저장한다.
    order.get(element).music.push({ numbers: index, plays: plays[index] });
    // 각각의 노래에를 music key로 호출된 배열에
    // numbers를 key, 각각의 노래 넘버를 value로 저장한다.
    // plays를 key, 각각의 노래 재생 횟수를 value로 저장한다.
  });
  order = [...order.entries()].sort((a, b) => b[1].totalPlay - a[1].totalPlay);
  // order.entries()로 key와 value를 배열로 묶은 객체를 반환한다.
  // ... spread 연산자로 객체를 풀어
  // key와 value를 묶은 배열을 가져온다.
  // b[0] : key, b[1] : value
  // b[1]로 value(현재 객체)에서 totalPlay
  // key에 따른 value를 가져와 비교한다.
  // -이면 앞으로 이동, + 이면 뒤로 이동, 0이면 그대로

  let result = [];
  // 결과를 담을 배열
  order.forEach(([genres, { music }]) => {
    // element를 이런식으로 풀어서
    // 객체의 key와 value(현재는 객체)를 가져올 수 있었다.
    // value(객체) 안에 music key만 가져온다.
    music.sort((a, b) => b.plays - a.plays || a.numbers - b.numbers);
    // sort로 music key안에 있는 두 요소를 가져온다
    // plays key로 두 요소의 실행 횟수를 비교한다.
    // - 앞으로 이동, + 뒤로 이동,
    // 이때 0 : 즉, false 이면
    // || 으로 뒤에 있는 내용이 실행되게 한다.
    // numbers로 노래 번호를 비교해
    // - 앞으로 이동, + 뒤로 이동, 0 그대로 이동시킨다.
    result.push(music[0].numbers);
    // 장르에서 가장 앞에 있는 노래를 저장한다.
    if (music[1]) result.push(music[1].numbers);
    // if(music[1])로 0 : False, 0이외 : True
    // 로 2번 째 노래가 있으면 저장한다.
  });
  return result;
};

genres = ["classic", "pop", "classic", "classic", "pop"];
plays = [500, 600, 150, 800, 2500];

console.log(makeAlbum(genres, plays));
