class VocabularyWordsController < ApplicationController
  before_action :set_vocabulary_word, only: [:show, :edit, :update, :destroy]
  before_action :set_activity, only: [:index, :new, :create]
  # GET /vocabulary_words
  # GET /vocabulary_words.json
  def index
    @vocabulary_words = @activity.vocabulary_words
  end

  # GET /vocabulary_words/1
  # GET /vocabulary_words/1.json
  def show
  end

  # GET /vocabulary_words/new
  def new
    @vocabulary_word = VocabularyWord.new
  end

  # GET /vocabulary_words/1/edit
  def edit
  end

  # POST /vocabulary_words
  # POST /vocabulary_words.json
  def create
    @vocabulary_word = VocabularyWord.new(vocabulary_word_params)

    respond_to do |format|
      if @vocabulary_word.save
        format.html { redirect_to @vocabulary_word, notice: 'Vocabulary word was successfully created.' }
        format.json { render :show, status: :created, location: @vocabulary_word }
      else
        format.html { render :new }
        format.json { render json: @vocabulary_word.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /vocabulary_words/1
  # PATCH/PUT /vocabulary_words/1.json
  def update
    respond_to do |format|
      if @vocabulary_word.update(vocabulary_word_params)
        format.html { redirect_to @vocabulary_word, notice: 'Vocabulary word was successfully updated.' }
        format.json { render :show, status: :ok, location: @vocabulary_word }
      else
        format.html { render :edit }
        format.json { render json: @vocabulary_word.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /vocabulary_words/1
  # DELETE /vocabulary_words/1.json
  def destroy
    @vocabulary_word.destroy
    respond_to do |format|
      format.html { redirect_to vocabulary_words_url, notice: 'Vocabulary word was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_vocabulary_word
      @vocabulary_word = VocabularyWord.find(params[:id])
    end

    def set_activity
      @activity = Activity.find(params[:activity_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def vocabulary_word_params
      params.require(:vocabulary_word).permit(:activity_id, :text, :description, :example, :order)
    end
end
