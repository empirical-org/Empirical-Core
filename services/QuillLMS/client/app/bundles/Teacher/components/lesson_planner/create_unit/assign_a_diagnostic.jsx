import React from 'react';
import AssignmentTypeMini from './assignment_type_mini';
import LaunchingSoonMini from './launching_soon_mini';

export default React.createClass({

  minis() {
    const minis =
      [
        (<a
          href={`${process.env.DEFAULT_URL}/diagnostic/-LKX2sTTnPVhTOrWyUx9/stage/2`}
          key={1}
        >
          <AssignmentTypeMini
            title={'Starter Diagnostic'}
            img={`${process.env.CDN_URL}/images/shared/new_diagnostic.svg`}
            link="/diagnostic/-LKX2sTTnPVhTOrWyUx9/stage/2"
            bodyText={'Covers foundational writing skills like using proper capitalization and adverbs.'}
            directions={'use intermittently'}
            quantity={1}
            unit={'Diagnostic'}
            timeDuration={'~20 Min.'}
          />
        </a>),
        (<a
          href={`${process.env.DEFAULT_URL}/diagnostic/-LKbzH_Er916zGjgHk5U/stage/2`}
          key={2}
        >
          <AssignmentTypeMini
            title={'Intermediate Diagnostic'}
            img={`${process.env.CDN_URL}/images/shared/new_diagnostic.svg`}
            link="/diagnostic/-LKbzH_Er916zGjgHk5U/stage/2"
            bodyText={'Covers sentence construction skills like forming compound sentences.'}
            directions={'use intermittently'}
            quantity={1}
            unit={'Diagnostic'}
            timeDuration={'~20 Min.'}
          />
        </a>),
        (<a
          href={`${process.env.DEFAULT_URL}/diagnostic/-LVxlcVPdW5DvAh_xgnj/stage/2`}
          key={3}
        >
          <AssignmentTypeMini
            title={'Advanced Diagnostic'}
            img={`${process.env.CDN_URL}/images/shared/new_diagnostic.svg`}
            link="/diagnostic/-LVxlcVPdW5DvAh_xgnj/stage/1"
            bodyText={'Covers advanced sentence skills like using appositive and participial phrases.'}
            directions={'use intermittently'}
            quantity={1}
            unit={'Diagnostic'}
            timeDuration={'~30 Min.'}
          />
        </a>),
        (<a key={4} href={`${process.env.DEFAULT_URL}/diagnostic/ell/stage/2`}>
          <AssignmentTypeMini
            title={'ELL Diagnostic'}
            img={`${process.env.CDN_URL}/images/shared/diagnostic_ell.svg`}
            link="/diagnostic/ell/stage/2"
            bodyText={'Covers areas specific to language learners like articles and subject-verb agreement.'}
            directions={'use intermittently'}
            quantity={1}
            unit={'Diagnostic'}
            timeDuration={'~25 Min.'}
          />
        </a>)
      ];
    return minis;
  },

  render() {
    return (
      <div id="assign-a-diagnostic-page" className="text-center">
        <h1>Choose which type of diagnostic you'd like to use:</h1>
        <div className="minis">{this.minis()}</div>
      </div>
    );
  },
});
