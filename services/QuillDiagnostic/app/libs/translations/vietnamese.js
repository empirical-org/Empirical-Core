const buttonText = {
  'submit button text': 'Gửi',
  'resume button text': 'Hồ sơ Cá nhân',
  'begin button text': 'Bắt đầu',
  'continue button text': 'Tiếp tục',
  'sentence fragment complete button': 'Hoàn thành câu',
  'sentence fragment incomplete button': 'Câu không đầy đủ',
};

const titleCards = {
  'titlecard-ell-fill-in-multiple-blanks': '<h1>Điền vào chỗ trống: A, An, The</h1><p>Trong phần này, mỗi câu sẽ có hai hoặc ba chỗ trống.</p><p>Bạn sẽ điền vào chỗ trống bằng một trong những từ có trong danh sách, hoặc để trống nếu không cần từ nào.</p>',
  'titlecard-ell-fill-in-single-blank': '<h1>Điền vào chỗ trống</h1><p>Bạn đã đi được nữa đường! Trong phần này, bạn sẽ chọn từ thích hợp nhất để hoàn thành câu. Bạn sẽ điền vào chỗ trống bằng một trong những từ có trong danh sách.</p>',
  'titlecard-ell-complete-sentences': '<h1>Hoàn thành Câu</h1><p>Trong phần này, bạn sẽ thêm vào một nhóm từ để tạo thành một câu hoàn chỉnh. Thêm càng ít từ càng tốt.</p><p>Bắt đầu!</p>',
  'titlecard-ell-past-present-and-future-tense': '<h1>Thì Quá khứ, Hiện tại và Tương lai</h1><p>Trong phần này, bạn sẽ sửa lại câu bằng cách đặt các động từ vào đúng thì để khớp với phần còn lại của câu. Bạn đang làm rất tốt cho đến lúc này!</p>',
  'titlecard-ell-sentence-combining': '<h1>Kết hợp câu</h1><p>Trong phần này, bạn sẽ kết hợp các câu thành một câu.</p><p>Đôi khi sẽ có các liên từ để bạn lựa chọn, nhưng đôi khi bạn sẽ phải chọn cách riêng của mình để kết hợp các câu lại với nhau.</p><p>Chỉ thêm hoặc thay đổi từ khi cần, và cố gắng không làm thay đổi ý nghĩa của các câu.</p><p>Bạn đã hoàn thành!</p>',
  'diagnostic intro text': '<h1>Hoạt động Sắp xếp Quill</h1><p>Bạn chuẩn bị trả lời 21 câu hỏi về viết câu. Đừng lo lắng, đây không phải là một bài kiểm tra. Nó chỉ dùng để xem bạn biết những gì.</p><p>Một số câu hỏi có thể về những điều bạn chưa được học - không sao cả! Chỉ cần trả lời tốt nhất có thể.</p><p>Sau khi hoàn thành, Quill sẽ tạo ra một kế hoạch học tập dành cho riêng bạn!</p>',
  'completion page': '<h1>Bạn đã Hoàn thành Hoạt động Sắp xếp Quill!</h1><p>Kết quả của bạn đang được lưu lại. Bạn sẽ được tự động chuyển hướng sau khi quá trình lưu hoàn tất</p>',
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': 'Thêm nhóm từ để tạo thành một câu hoàn chỉnh. Thêm càng ít từ càng tốt.',
  'fill-in-the-blank-multiple-instructions': 'Điền vào chỗ trống bằng một trong các từ bên trên. Nếu không cần từ nào, hãy để trống.',
  'fill-in-the-blank-single-instructions': 'Điền vào chỗ trống bằng một trong các từ bên trên.',
  'tense-question-instructions': 'Viết lại câu. Sửa các động từ in đậm theo đúng thì để khớp với phần còn lại của câu.',
  'combine-sentences-instructions': 'Kết hợp các câu thành một câu.',
  'combine-sentences-with-joining-words-instructions': 'Kết hợp các câu thành một câu. Sử dụng một trong số các liên từ.',
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
