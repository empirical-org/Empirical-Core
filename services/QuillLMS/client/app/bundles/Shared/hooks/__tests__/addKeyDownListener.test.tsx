import { renderHook } from "@testing-library/react-hooks";

import { addKeyDownListener } from "../addKeyDownListener";

describe("addKeyDownListener tests", () => {
  it("adds keydown event listener with passes function", () => {
    const mockHandleKeyDown = jest.fn();
    const events = {};
    jest.spyOn(document, 'addEventListener').mockImplementation((event, handle, options?) => {
      events[event] = handle;
    });
    renderHook(() => addKeyDownListener(mockHandleKeyDown));
    expect(document.addEventListener).toBeCalledWith('keydown', mockHandleKeyDown);
  });
});
