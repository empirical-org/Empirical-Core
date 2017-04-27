const buttonText = {
  'submit button text': 'Dệ trình',
  'resume button text': 'Bắt đầu trở lại',
  'begin button text': 'Bắt đầu',
  'continue button text': 'Tiếp tục',
  'sentence fragment complete button': 'Hoàn thành câu',
  'sentence fragment incomplete button': 'Câu không đầy đủ',
};

const titleCards = {
  'fill in multiple blanks title card': '<h1>Điền vào ô trống: A, An, The</h1><p>Trong phần này, mỗi câu sẽ có hai hoặc ba khoảng trắng.</p><p>Bạn sẽ viết lại câu, điền vào chỗ trống bằng một trong những từ trong danh sách hoặc chọn không có từ nào cần thiết trong khoảng trắng.</p>',
  'fill in single blanks title card': '<h1>Điền vào chỗ trống</h1><p>Bạn đang ở đâu đó! Trong phần này, bạn sẽ chọn từ tốt nhất để hoàn thành câu. Bạn sẽ viết lại một câu, điền vào chỗ trống bằng một trong những từ trong danh sách.</p>',
  'sentence fragments title card': '<h1>Câu hoàn chỉnh</h1><p>Trong phần này, bạn sẽ thêm vào một nhóm từ để thực hiện một câu hoàn chỉnh. Thêm càng ít từ càng tốt.</p><h1><p>Hãy bắt đầu!</p>',
  'tense title card': '<h1>Quá khứ, hiện tại và tương lai căng thẳng</h1><p>Trong phần này, bạn sẽ sửa các câu bằng cách đặt động từ đúng để khớp với phần còn lại của câu. Bạn đang làm tốt cho đến nay!</p>',
  'sentence combining title card': '<h1>Kết hợp câu</h1><p>Trong phần này, bạn sẽ kết hợp các câu thành một câu</p><p>Đôi khi bạn sẽ được kết hợp từ để lựa chọn, và đôi khi bạn sẽ phải chọn cách riêng của bạn để kết hợp các câu.</p><p>Chỉ thêm hoặc thay đổi từ khi bạn cần, và cố gắng giữ ý nghĩa của các câu như nhau.</p><p>Bạn đã có điều này!</p>',
  'diagnostic intro text': '<h1>Hoạt động Đặt Quill</h1><p>Bạn sắp trả lời 22 câu hỏi về viết câu. Đừng lo lắng, nó không phải là một thử nghiệm. Nó chỉ để tìm ra những gì bạn biết.</p><p>Một số câu hỏi có thể là về những điều bạn chưa học được - được rồi! Chỉ cần trả lời họ càng tốt càng tốt.</p><p>Một khi bạn đã hoàn thành, Quill sẽ tạo ra một kế hoạch học tập chỉ dành cho bạn!</p>',
  'completion page': '<h1>Bạn đã hoàn thành Hoạt động Vị trí Quill!</h1></p>Kết quả của bạn đang được lưu lại. Bạn sẽ được tự động chuyển hướng khi chúng được lưu.</p>',
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': 'Thêm vào nhóm từ để thực hiện một câu hoàn chỉnh. Thêm càng ít từ càng tốt.',
  'fill-in-the-blank-multiple-instructions': 'Điền vào chỗ trống với một trong các bài viết sau đây: a, an, the. Nếu không có bài viết là cần thiết, loại bỏ các trống.',
  'fill-in-the-blank-single-instructions': 'Viết lại câu. Điền vào ô trống bằng một trong những từ sau: on, in, at, to',
  'tense-question-instructions': 'Viết lại câu. Đúng động từ in đậm vì vậy nó có trong đúng thời gian để khớp với phần còn lại của câu.',
  'combine-sentences-instructions': 'Kết hợp các câu thành một câu.',
  'combine-sentences-with-joining-words-instructions': 'Kết hợp các câu thành một câu. Sử dụng một trong những từ ghép nối.',
};

const scaffolds = {
  'joining word cues single': 'nhập từ',
  'joining word cues multiple': 'nhập từ',
  'add word bank cue': 'Thêm từ'
};

const exampleTranslation = {
  ...instructions,
  ...titleCards,
  ...buttonText,
  ...scaffolds,
};

export default exampleTranslation;
