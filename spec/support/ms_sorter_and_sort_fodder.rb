shared_context :ms_sorter_and_sort_fodder do
  let(:ms_sorter) do
    FactoryGirl.create :teacher, name: 'Sally Sorter',
                              username: 'ms_sorter'
  end
  let(:sort_fodder) do
    FactoryGirl.create :classroom, name: 'Sort Fodder',
                                teacher: ms_sorter
  end

  def add_sort_fodder(hash)
    attribs = FactoryGirl.attributes_for :student, first_name: nil,
                                                    last_name: nil

    sort_fodder.students.create(attribs.merge(hash))
  end

  # Ideally, they are listed below and, thus, created in
  # a different order than is expected on the view(s)

  let(:alex_smith) do
    add_sort_fodder name: 'Alex Smith',
                username: "alexsmith@#{sort_fodder.code}"
  end

  let(:christine_no_last_name) do
    add_sort_fodder name: 'Christine',
                username: "christine@#{sort_fodder.code}"
  end

  let(:chris_no_last_name) do
    add_sort_fodder name: 'Chris',
                username: 'christine'
  end

  let(:alex_brown) do
    add_sort_fodder name: 'Alex Brown',
                username: 'alexbrown'
  end

  let(:christopher_no_last_name) do
    add_sort_fodder name: 'Christopher',
                username: 'christopher'
  end

  let(:christopher_brown) do
    add_sort_fodder name: 'Christopher Brown',
                username: 'cbrown'
  end

  let(:christine_brown) do
    add_sort_fodder name: 'Christine Brown',
                username: "christinebrown@#{sort_fodder.code}"
  end

  let!(:sort_fodder_sorted) do
    # sorted by (last, first) name
    # understanding that for students with only a single 'name,'
    # it serves as both their first and last names
    [alex_brown,
     christine_brown,
     christopher_brown,
     chris_no_last_name,
     christine_no_last_name,
     christopher_no_last_name,
     alex_smith]
  end
end
