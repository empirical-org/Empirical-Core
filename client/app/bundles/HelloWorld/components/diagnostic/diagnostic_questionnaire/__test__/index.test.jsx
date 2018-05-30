import React from 'react';
import renderer from 'react-test-renderer';
import Index from '../index';

describe('<Index />',() =>{
    it('should render the childeren',()=>{
        const tree = renderer.create(
            <Index>Some Text</Index>).toJSON();
            expect(tree).toMatchSnapshot();
        
    });
});