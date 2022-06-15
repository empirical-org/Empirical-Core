import React from 'react';
import { shallow } from 'enzyme';

import UnitTemplate from '../unitTemplate';

const unitTemplate = {'id':34,'name':'barebones activity','problem':'bloopd i am problem rawr','summary':'bloop','teacher_review':'lalala','time':20,'grades':['1'],'order_number':1,'number_of_standards':1,'activity_info':'<p class="hi">hi there</p>','activities':[{'uid':'-KCNLERe7k5EKlr2sm1b','id':303,'name':'From','description':'Write five sentences using the correct preposition.','flags':['production'],'data':null,'created_at':'2016-03-08T22:28:58.921Z','updated_at':'2016-03-17T19:06:21.724Z','anonymous_path':'/activity_sessions/anonymous?activity_id=303','classification':{'uid':'s2u3tVuguhfUjOQxDP-7RA','id':2,'name':'Quill Grammar','key':'sentence','form_url':'https://grammar.quill.org/play/sw','module_url':'https://grammar.quill.org/play/sw','created_at':'2014-04-19T00:05:03.113Z','updated_at':'2017-01-24T16:06:52.270Z','image_class':'icon-puzzle-gray','alias':'Quill Grammar','scorebook_icon_class':'icon-puzzle'},'standard':{'id':6,'name':'1.1i. Frequently Occurring Prepositions','created_at':'2014-04-19T15:42:40.907Z','updated_at':'2015-02-07T21:55:22.303Z','standard_level':{'id':7,'name':'1st Grade CCSS','created_at':'2013-11-12T18:03:10.973Z','updated_at':'2015-02-27T22:02:03.770Z'},'standard_category':{'id':5,'name':'Prepositions','created_at':'2015-02-07T21:55:22.293Z','updated_at':'2015-02-07T21:55:22.293Z'}}}],'unit_template_category':{'id':3,'name':'ELL','primary_color':'.348fdf','secondary_color':'.014f92'},'author':{'id':6,'name':'Sara A.','avatar_url':'https://empirical-core-dev.s3.amazonaws.com/authors/avatars/000/000/006/thumb/Sara_Angel_96.png?1451924889','description':'I am a human'},'non_authenticated':false}

describe('UnitTemplate component', () => {

  describe('Markdown Preview', () => {
    it('should not render without activity_info in the state', () => {
      const wrapper = shallow(
        <UnitTemplate
          returnToIndex={() => null}
          unitTemplate={unitTemplate}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

  });
});
