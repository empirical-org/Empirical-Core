const mockDispatch = jest.fn()
mockDispatch.mockImplementation((action: any, state: any) => {
  if (action instanceof Function) {
    action(mockDispatch, state)
  }
})

export {
  mockDispatch,
}
