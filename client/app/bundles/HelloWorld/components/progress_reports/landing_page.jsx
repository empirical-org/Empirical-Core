import React from 'react'
import GenericMini from '../shared/generic_mini.jsx'

export default React.createClass({

	miniList: function() {
		return [
			{
				title: 'Visual Overview',
				href: '/teachers/classrooms/scorebook',
				img: '/images/visual_overview.svg',
				bodyText: 'Quickly see which activities your students have completed with color coded icons that show level of proficiency.'
			}, {
				title: 'Activity Analysis',
				href: '/teachers/progress_reports/diagnostic_reports#/activity_packs',
				img: '/images/activity_analysis.svg',
				bodyText: 'See how students responded to each question and get a clear analysis of the skills they demonstrated.'
			}, {
				title: 'Diagnostic',
				href: '/teachers/classrooms/scorebook',
				img: '/images/diagnostic.svg',
				bodyText: 'View the results of the diagnostic, and get a personalized learning plan with recommended activities.'
			}, {
				title: 'List Overview',
				premium: true,
				href: '/teachers/classrooms/scorebook',
				img: '/images/list_overview.svg',
				bodyText: 'Get the big picture of how your students are performing with the list view. Easily download the reports as a CSV.'
			}, {
				title: 'Concepts',
				premium: true,
				href: '/teachers/progress_reports/concepts/students',
				img: '/images/concepts.svg',
				bodyText: 'View an overall summary of how each of your students is performing on all of the  grammar concepts.'
			}, {
				title: 'Common Core Standards',
				premium: true,
				href: '/teachers/progress_reports/standards/classrooms',
				img: '/images/common_core.svg',
				bodyText: 'Following the Common Core? Check this view to see how your students are performing on specific standards.'
			}
		]
	},

	miniBuilder: function(mini) {
		const premium = mini.premium ?  <h4 className='premium'>Premium<i className="fa fa-star" aria-hidden="true"></i></h4> : null
		return (
			<GenericMini key={mini.title}>
				<a href={mini.href}>
					<h3>{mini.title}</h3>
					{premium}
					<div className="img-wrapper">
						<img src={mini.img}/>
					</div>
					<p>{mini.bodyText}</p>
				</a>
			</GenericMini>
		)
	},

	minis: function() {
		return this.miniList().map((mini) => this.miniBuilder(mini))
	},

	render: function() {
		return (
			<div className="generic-mini-container">
				<h1>Choose which type of report you’d like to see:</h1>
				<div className='generic-minis'>{this.minis()}</div>
			</div>
		);
	}
})
