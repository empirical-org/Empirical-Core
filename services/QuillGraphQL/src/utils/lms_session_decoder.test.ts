import {parseCookiesString} from './lms_session_decoder'

const sampleCookie = "_ga=GA1.1.271975334.1501270075; __insp_uid=1455788531; __insp_wid=2022824673; __insp_slim=1538540190828; __insp_nv=false; __insp_targlpu=aHR0cDovL2xvY2FsaG9zdDo4MDgwLw%3D%3D; __insp_targlpt=UXVpbGwgQ29ubmVjdA%3D%3D; __insp_norec_sess=true; _quill_development_session=YUxoSVVUVDJiSXp2Z2JqYU83OFIrQjJjZStOSS94K1J2VWdpa042U0VrRjhzaG9KM2t5OENQTnVxSFFzY0RxdDJ2S2FPOUNWRmQwa25MY2JPWnlwdEQ3b25hcUNVMnd5Mzh2RzMvS3p1b1AzbVBqSy9iUlN0M1NkWXBOTjkvclBYWkxzRUcyblhUcmJpNktPK2Z2cmRuak5KdXlSZWJKSkVIR3F6RW1DT2IvVVl3RVlqcFk2M09wOVRHeDhYRStIVzJLbkpwZ3UxY2IySXVJQU9uZS80Rkd5RnEyNXYyaVc3dzJQcVRtU0xaZz0tLThxOFNKTDk4Yy9mK2k3bGw0aXg0dXc9PQ%3D%3D--197921ff83b6fdf00f32b258fef53976e0fff167; _gid=GA1.1.899438048.1546972580";

const testCookie = "a=1; b=2; c=3";


test('parsing a cookies string', () => {
  const expected = {
    a: "1",
    b: "2",
    c: "3"
  }
  expect(parseCookiesString(testCookie)).toEqual(expected)
});