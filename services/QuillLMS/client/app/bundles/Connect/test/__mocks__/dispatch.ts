const mockDispatch = jest.fn()
mockDispatch.mockImplementation((action: any) => {
  if (action instanceof Function) {
    action(mockDispatch)
  }
})

export {
  mockDispatch,
}