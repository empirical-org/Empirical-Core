class WorkbooksController < ApplicationController
  # GET /workbooks
  # GET /workbooks.json
  def index
    @workbooks = Workbook.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @workbooks }
    end
  end

  # GET /workbooks/1
  # GET /workbooks/1.json
  def show
    @workbook = Workbook.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @workbook }
    end
  end

  # GET /workbooks/new
  # GET /workbooks/new.json
  def new
    @workbook = Workbook.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @workbook }
    end
  end

  # GET /workbooks/1/edit
  def edit
    @workbook = Workbook.find(params[:id])
  end

  # POST /workbooks
  # POST /workbooks.json
  def create
    @workbook = Workbook.new(params[:workbook])

    respond_to do |format|
      if @workbook.save
        format.html { redirect_to @workbook, notice: 'Workbook was successfully created.' }
        format.json { render json: @workbook, status: :created, location: @workbook }
      else
        format.html { render action: "new" }
        format.json { render json: @workbook.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /workbooks/1
  # PUT /workbooks/1.json
  def update
    @workbook = Workbook.find(params[:id])

    respond_to do |format|
      if @workbook.update_attributes(params[:workbook])
        format.html { redirect_to @workbook, notice: 'Workbook was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @workbook.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /workbooks/1
  # DELETE /workbooks/1.json
  def destroy
    @workbook = Workbook.find(params[:id])
    @workbook.destroy

    respond_to do |format|
      format.html { redirect_to workbooks_url }
      format.json { head :no_content }
    end
  end
end
