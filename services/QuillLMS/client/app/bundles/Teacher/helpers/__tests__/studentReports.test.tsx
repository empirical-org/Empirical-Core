import { getTimeSpent } from '../studentReports';

describe('Student Reports helper functions', () => {

  describe('#getTimeSpent', () => {
    it('should return expected time formatting', () => {
      expect(getTimeSpent(30)).toEqual('30 seconds')
      expect(getTimeSpent(60)).toEqual('1 minute')
      expect(getTimeSpent(3599)).toEqual('59 minutes')
      expect(getTimeSpent(3600)).toEqual('1 hour')
      expect(getTimeSpent(3660)).toEqual('1 hr 1 min')
      expect(getTimeSpent(3720)).toEqual('1 hr 2 mins')
      expect(getTimeSpent(7200)).toEqual('2 hr')
    });
  });
});
