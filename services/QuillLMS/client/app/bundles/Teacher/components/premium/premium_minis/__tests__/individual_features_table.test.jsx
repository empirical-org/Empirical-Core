import { mount } from 'enzyme';
import * as React from 'react';

import { premiumFeatures } from '../../premium_features_data';
import IndividualFeaturesTable from '../individual_features_table';

describe('IndividualFeaturesTable container', () => {

  it('should render for each type', () => {
    const premiumFeatureData = premiumFeatures({ independentPracticeActivityCount: 400, diagnosticActivityCount: 9, lessonsActivityCount: 30, })
    expect(mount(<IndividualFeaturesTable premiumFeatureData={premiumFeatureData} type="basic" />)).toMatchSnapshot();
    expect(mount(<IndividualFeaturesTable premiumFeatureData={premiumFeatureData} type="teacher" />)).toMatchSnapshot();
    expect(mount(<IndividualFeaturesTable premiumFeatureData={premiumFeatureData} type="school" />)).toMatchSnapshot();
  });

});
